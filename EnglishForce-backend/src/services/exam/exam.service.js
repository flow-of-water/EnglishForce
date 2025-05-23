// services/exam.service.js
import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt, ExamPart, QuestionGroup } = db;

export const findExamIdByPublicId = async (publicId) => {
  const Exam = await Exam.findOne({ where: { public_id: publicId } });
  if (!Exam) throw new Error('Exam not found with that public_id');
  return Exam.id;
}


export const getAllExams = async (page = 1) => {
  const pageSize = 6;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await Exam.findAndCountAll({
    attributes: ['public_id', 'name', 'description', 'duration'],
    limit: pageSize,
    offset: offset,
    order: [['id', 'DESC']]
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / pageSize),
    currentPage: page,
    exams: rows
  };
};



// Lấy tất cả cây phân cấp của exam 
function buildNestedParts(part, partMap) {
  part.Children = part.Children.map(childId => {
    const childPart = partMap[childId];
    return childPart ? buildNestedParts(childPart, partMap) : null;
  }).filter(Boolean);
  return part;
}
export const getExamWithFullHierarchy = async (publicId , onlyCorrectAnswers = false) => {
  const exam = await db.Exam.findOne({
    where: { public_id: publicId },
    attributes: ['id', 'public_id', 'name', 'description', 'duration'],
  });

  if (!exam) throw new Error('Exam not found');

  // Step 1: Lấy tất cả các ExamParts của bài thi
  const allParts = await db.ExamPart.findAll({
    where: { exam_id: exam.id },
    order: [['order_index', 'ASC']],
    include: [
      {
        model: db.Question,
        attributes: ['id', 'public_id', 'content', 'type', 'thumbnail', 'record','order_index'],
        separate: true, // ⚠️ BẮT BUỘC nếu muốn order hoạt động
        order: [['order_index', 'ASC']],
        include: [
          {
            model: db.Answer,
            where: onlyCorrectAnswers ? { is_correct: true } : undefined,
            attributes: ['id', 'public_id', 'content', 'is_correct'],
            order: [['id', 'ASC']],
          }
        ]
      }
    ]
  });
  // Step 2: Convert về object thuần + chuẩn bị Map theo ID
  const partMap = {};
  allParts.forEach(part => {
    part = part.toJSON(); // make plain
    part.Children = [];
    partMap[part.id] = part;
  });

  // Step 3: Gắn part con vào cha (parent_part_id)
  // Ở đây CHildren nên chỉ gắn part.id thay vì part , để tránh trường hợp ông bà nhận thg con , sau đó thg con nhận cháu
  // => ông bà không nhận cháu   
  allParts.forEach(part => {
    if (part.parent_part_id) partMap[part.parent_part_id]?.Children.push(part.id);
  });

  var rootParts = [];
  allParts.forEach(part => {
    if (!part.parent_part_id) rootParts.push(partMap[part.id]);
  });
  rootParts = rootParts.map(root => buildNestedParts(root, partMap));

  return {
    public_id: exam.public_id,
    name: exam.name,
    description: exam.description,
    duration: exam.duration,
    parts: rootParts
  };
};

// ______


export const getExamShort = async (publicId) => {
  const exam = await db.Exam.findOne({
    where: { public_id: publicId },
    attributes: ['public_id', 'name', 'description', 'duration'],
  });

  return exam ? exam.toJSON() : null;
};




export const createExam = async ({ name, description, duration }) => {
  const newExam = await Exam.create({
    name,
    description: description || null,
    duration,
  });
  return newExam;
};

export const updateExamByPublicId = async (publicId, updates) => {
  const exam = await Exam.findOne({ where: { public_id: publicId } });

  if (!exam) {
    throw new Error('Exam not found');
  }

  await exam.update(updates);
  return exam;
};

export const deleteExamByPublicId = async (publicId) => {
  const exam = await Exam.findOne({ where: { public_id: publicId } });
  if (!exam) throw new Error('Exam not found');

  await exam.destroy(); // Sequelize cascade sẽ xóa các Question vì đã set `onDelete: CASCADE`
};


export const submitExamAttempt = async (body, userId) => {
  const { exam_public_id, answers } = body;

  const exam = await db.Exam.findOne({ where: { public_id: exam_public_id } });
  if (!exam) throw new Error('Exam not found');

  let correct = 0;
  const total = await Question.count({
    where: { exam_id: exam.id }
  });

  for (const { question_public_id, answer_ids } of answers) {
    const question = await db.Question.findOne({
      where: { public_id: question_public_id },
      include: [db.Answer]
    });
    const correctAnswers = question.Answers.filter(a => a.is_correct).map(a => a.public_id);
    if (JSON.stringify(correctAnswers.sort()) === JSON.stringify(answer_ids.sort())) correct++;
  }

  const score = (correct / total) * 100;
  const now = new Date();

  const attempt = await ExamAttempt.create({
    exam_id: exam.id,
    user_id: userId,
    start: now,
    end: now,
    score
  });

  return attempt.public_id;
};

export const getExamResult = async (attemptPublicId) => {
  const attempt = await db.ExamAttempt.findOne({
    where: { public_id: attemptPublicId },
  });

  if (!attempt) throw new Error('Attempt not found');

  const exam = await db.Exam.findByPk(attempt.exam_id);
  if (!exam) throw new Error('Exam not found for this attempt');

  const examInfor = await getExamWithFullHierarchy(exam.public_id, true); // lấy đáp án đúng thôi

  return {
    ...examInfor,
    score: attempt.score,
    duration: (new Date(attempt.end) - new Date(attempt.start)) / 60000,
  };
};