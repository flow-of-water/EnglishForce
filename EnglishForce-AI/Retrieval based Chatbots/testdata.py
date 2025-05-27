# test_dataset.py
test_dataset = [
    # 🟢 greeting
    ("Hello", "greeting_en"),
    ("Hey there", "greeting_en"),
    ("Is anyone there?", "greeting_en"),
    ("Có ai ở đó không", "greeting_vi"),
    ("Chào bạn nha", "greeting_vi"),
    ("Rất vui được gặp bạn lầu đầu", "greeting_vi"),

    # 🔴 goodbye
    ("Bye", "goodbye_en"),
    ("See you later", "goodbye_en"),
    ("Nice chatting to you, bye", "goodbye_en"),
    ("Tạm biệt nhé", "goodbye_vi"),
    ("Hẹn gặp lại sau", "goodbye_vi"),
    ("Rất vui được nói chuyện, chào tạm biệt", "goodbye_vi"),

    # 🟡 thanks
    ("Thanks a lot", "thanks_en"),
    ("That’s helpful", "thanks_en"),
    ("Thank you", "thanks_en"),
    ("Cảm ơn rất nhiều", "thanks_vi"),
    ("Bạn đã giúp tôi rất nhiều", "thanks_vi"),
    ("Cảm ơn vì đã hỗ trợ tôi", "thanks_vi"),

    # 🌐 web_feature
    ("Tell me about this platform", "web_feature"),
    ("What features are available on this website?", "web_feature"),
    ("What can I do here?", "web_feature"),
    ("Hãy cho tôi biết về nền tảng này", "web_feature"),
    ("Trang web này có những chức năng gì vậy?", "web_feature"),
    ("Tôi có thể làm gì khi sử dụng hệ thống này?", "web_feature"),

    # 🤖 chatbot_ability
    ("What can you do?", "chatbot_ability"),
    ("What are your abilities?", "chatbot_ability"),
    ("How can you assist in learning English?", "chatbot_ability"),
    ("Bạn có thể làm gì?", "chatbot_ability"),
    ("Bạn giúp tôi học tiếng Anh như thế nào?", "chatbot_ability"),
    ("Khả năng của bạn là gì vậy?", "chatbot_ability"),

    # 💡 learning_tips
    ("Give me some tips to learn English.", "learning_tips_en"),
    ("What are your top tips for learning English?", "learning_tips_en"),
    ("How can I study English more efficiently?", "learning_tips_en"),
    ("Bạn có mẹo nào để học tiếng Anh không?", "learning_tips_vi"),
    ("Mẹo học tiếng Anh nhanh và hiệu quả là gì?", "learning_tips_vi"),
    ("Làm sao để học tiếng Anh tốt hơn mỗi ngày?", "learning_tips_vi"),

    # 📖 book_recommendation
    ("Can you recommend me a book to learn English?", "book_recommendation_en"),
    ("What books should I read to improve my English?", "book_recommendation_en"),
    ("Suggest some English learning books.", "book_recommendation_en"),
    ("Bạn có thể gợi ý sách học tiếng Anh không?", "book_recommendation_vi"),
    ("Tôi nên đọc sách gì để giỏi tiếng Anh hơn?", "book_recommendation_vi"),
    ("Có sách nào giúp tôi học tiếng Anh hiệu quả không?", "book_recommendation_vi"),

    # 📝 exam_recommendation
    ("Which English exam should I take?", "exam_recommendation_en"),
    ("Can you recommend a test for my English level?", "exam_recommendation_en"),
    ("What English tests are good for job applications?", "exam_recommendation_en"),
    ("Tôi nên thi chứng chỉ tiếng Anh nào?", "exam_recommendation_vi"),
    ("Bạn gợi ý giúp tôi một kỳ thi tiếng Anh phù hợp nhé?", "exam_recommendation_vi"),
    ("Thi TOEIC, IELTS hay cái nào tốt hơn?", "exam_recommendation_vi"),

    # ❓ why_learn_english
    ("Why should I learn English?", "why_learn_english_en"),
    ("Is learning English important?", "why_learn_english_en"),
    ("What are the benefits of learning English?", "why_learn_english_en"),
    ("Tại sao tôi nên học tiếng Anh?", "why_learn_english_vi"),
    ("Học tiếng Anh để làm gì?", "why_learn_english_vi"),
    ("Lợi ích của việc học tiếng Anh là gì?", "why_learn_english_vi"),

    # 💪 motivational_quote
    ("Give me a motivational quote.", "motivational_quote_en"),
    ("I need some inspiration to keep learning.", "motivational_quote_en"),
    ("Tell me something motivational.", "motivational_quote_en"),
    ("Cho tôi một câu nói tạo động lực.", "motivational_quote_vi"),
    ("Tôi cần cảm hứng để tiếp tục học tiếng Anh.", "motivational_quote_vi"),
    ("Bạn có thể nói gì đó truyền cảm hứng cho tôi không?", "motivational_quote_vi"),

    # 🛠️ technical_support
    ("I can't hear the audio. Can you help?", "technical_support_en"),
    ("The web is not working properly.", "technical_support_en"),
    ("How do I report a technical issue?", "technical_support_en"),
    ("Tôi không nghe được âm thanh, giúp tôi với.", "technical_support_vi"),
    ("Ứng dụng bị lỗi, tôi phải làm sao?", "technical_support_vi"),
    ("Làm sao để báo lỗi kỹ thuật cho bạn?", "technical_support_vi"),


    ###
    # Interactive prompt that Chatbot need to query database 
    ###

    # 🎯 course_recommendation
    ("Can you recommend me an English course?", "course_recommendation_en"),
    ("Which course is best for beginners?", "course_recommendation_en"),
    ("What course should I take to improve my English?", "course_recommendation_en"),
    ("Bạn có thể gợi ý khoá học tiếng Anh cho tôi không?", "course_recommendation_vi"),
    ("Tôi mới bắt đầu học, nên học khoá nào?", "course_recommendation_vi"),
    ("Tôi muốn cải thiện tiếng Anh, nên học khoá nào?", "course_recommendation_vi"),

    # 📘 course_info
    ("Tell me more about this course.", "course_info_en"),
    ("What will I learn in this course?", "course_info_en"),
    ("Can you give me an overview of this course?", "course_info_en"),
    ("Khoá học này dạy những gì?", "course_info_vi"),
    ("Cho tôi biết tổng quan của khóa học này", "course_info_vi"),
    ("Bạn cho tôi biết thêm về khoá học này được không?", "course_info_vi"),

    # 📝 exam_info
    ("Can you tell me more about the exam?", "exam_info_en"),
    ("Give me information about this exam", "exam_info_en"),
    ("What is the duration of the exam?", "exam_info_en"),
    ("Nói cho tôi những gì bạn biết về kì thi?", "exam_info_vi"),
    ("Bạn có thể cho tôi biết thêm thông tin về kỳ thi không?", "exam_info_vi"),
    ("Kỳ thi này có những thông tin gì?", "exam_info_vi"),

    # 📈 learning_progress
    ("How is my learning progress?", "learning_progress_en"),
    ("Can you show me my English learning status?", "learning_progress_en"),
    ("How much have I completed in program?", "learning_progress_en"),
    ("Tiến độ học của tôi thế nào rồi?", "learning_progress_vi"),
    ("Tôi đã hoàn thành bao nhiêu phần rồi?", "learning_progress_vi"),
    ("Bạn có thể cho tôi xem tiến trình học không?", "learning_progress_vi"),

]
