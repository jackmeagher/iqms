# IQMS
Interview Question Management System for CSCI 462




# (incredibly sexy) REST API DOCUMENTATION

##Question
####/question
* **GET**  : returns all questions (params : 'question_text' , 'difficulty')
* **POST** : insert new question

####/question/:id
* **GET**    : gets a question by id
* **DELETE** : deletes a question by id

## Interview
####/interview
* **GET**  : returns all interviews
* **POST** : insert a new interview

####/interview/:id
* **GET**    : gets an interview by id
* **DELETE** : deletes an interview by id

####/interview/:id/questions
* **GET** : returns all questions in interview[id]
	
####/interview/:id/questions/:question_id
* **POST**   : adds question[question_id] to interview [id]
* **DELETE** : removes question[question_id] from interview [id]

## Answer
####/answer
* **GET**  : returns all answers
* **POST** : creates new answer (params : 'feedback', 'rating')

####/answer/:id
* **GET**    : gets answer by id
* **DELETE** : deletes an answer by id

## User
####/user
* **GET**  : returns all users
* **POST** : creates new user

####/user/:id
* **GET**    : gets user by id
***DELETE** : deletes an user by id
