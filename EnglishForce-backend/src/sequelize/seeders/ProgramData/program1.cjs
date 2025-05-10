// data/programData.cjs
'use strict';

module.exports =  {
  name: "Section 1: English Starter Program",
  description: "A beginner-level English program.",
  thumbnail: "https://example.com/thumb.jpg",
  order_index: 0,
  units: [
    {
      name: "Unit 1: Gọi đồ uống",
      description: "Trong bài học này, bạn sẽ học cách gọi đồ uống bằng tiếng Anh.",
      order_index: 0,
      lessons: [
        {
          name: "Lesson 1",
          order_index: 0,
          exercises: [
            {
              question: "Cà phê",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Coffee", is_correct: true },
                { content: "Tea", is_correct: false },
                { content: "Hello", is_correct: false },
                { content: "Water", is_correct: false },
              ]
            },
            {
              question: "Hello, Lisa!",
              type: "speaking",
              order_index: 1,
              answers: [
              ]
            },
            {
              question: "Write in Vietnamese: Tea or Coffee ?",
              type: "writing",
              order_index: 2,
              answers: [
              ]
            }
          ]
        }
      ]
    }
  ]
};
