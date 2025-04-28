// services/exam.service.js
import db from '../../sequelize/models/index.js';
const { Exam, Question, Answer, ExamAttempt, ExamPart, QuestionGroup } = db;

export const findExamIdByPublicId = async (publicId) => {
  const Exam = await Exam.findOne({ where: { public_id: publicId } });
  if (!Exam) throw new Error('Exam not found with that public_id');
  return Exam.id;
}


export const getAllExams = async () => {
  return await Exam.findAll({
    attributes: ['public_id', 'name', 'description', 'duration']
  });
};

export const getExamWithFullHierarchy = async (publicId) => {
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
        attributes: ['id', 'public_id', 'content', 'type', 'thumbnail', 'record'],
        include: [
          {
            model: db.Answer,
            attributes: ['id', 'public_id', 'content', 'is_correct'],
            order: [['id', 'ASC']],
          }
        ]
      }
    ]
  });

  // Step 2: Tạo map từ partId → ExamPart
  const partMap = {};
  allParts.forEach(part => {
    part = part.toJSON(); // make plain
    part.Children = [];
    partMap[part.id] = part;
  });
  console.log(partMap);

  // Step 3: Xây dựng cây phân cấp
  const rootParts = [];
  allParts.forEach(part => {
    if (part.parent_part_id) partMap[part.parent_part_id]?.Children.push(part);
  });
  allParts.forEach(part => {
    if (!part.parent_part_id) rootParts.push(partMap[part.id]);
  });
  console.log("ROOTTTT : ",rootParts);
  return {
    public_id: exam.public_id,
    name: exam.name,
    description: exam.description,
    duration: exam.duration,
    parts: rootParts
  };
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

  await ExamAttempt.create({
    exam_id: exam.id,
    user_id: userId,
    start: now,
    end: now,
    score
  });
};

export const getExamResult = async (publicId, userId) => {
  const exam = await Exam.findOne({
    where: { public_id: publicId },
    include: {
      model: Question,
      include: [Answer]
    }
  });

  const attempt = await ExamAttempt.findOne({
    where: { exam_id: exam.id, user_id: userId },
    order: [['created_at', 'DESC']]
  });
  if (!attempt) throw new Error('No attempt');

  const questions = exam.Questions.map(q => {
    const correct_answers = q.Answers.filter(a => a.is_correct).map(a => a.content);
    return {
      public_id: q.public_id,
      content: q.content,
      correct_answers,
      selected_answers: ['...'], // TODO: fetch user answers if stored
    };
  });

  return {
    score: attempt.score,
    duration: (new Date(attempt.end) - new Date(attempt.start)) / 60000,
    questions
  };
};