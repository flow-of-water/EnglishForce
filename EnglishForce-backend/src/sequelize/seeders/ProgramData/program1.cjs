// data/programData.cjs
'use strict';

module.exports =  {
  name: "English Starter Program",
  description: "A beginner-level English course.",
  thumbnail: "https://example.com/thumb.jpg",
  order_index: 0,
  units: [
    {
      name: "Unit 1: Greetings",
      description: "Say hello and goodbye.",
      order_index: 0,
      lessons: [
        {
          name: "Lesson 1: Hello",
          description: "How to greet",
          order_index: 0,
          type: "vocabulary",
          exercises: [
            {
              question: "Say Hello",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Hello", is_correct: true },
                { content: "Bye", is_correct: false }
              ]
            },

            {
              question: "Say Bye",
              type: "single_choice",
              order_index: 0,
              answers: [
                { content: "Hello", is_correct: false },
                { content: "Bye", is_correct: true }
              ]
            }
          ]
        }
      ]
    }
  ]
};
