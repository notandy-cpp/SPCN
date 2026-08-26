const Question = require('../model/question')


const createQuestion = async(data) =>
{
    try
    {
        const question = new Question(data);
        await question.save();
        return question;
    }
    catch (error)
    {
        throw error;
    }
}

const getQuestions = async() =>
{
    try
    {
        const questions = await Question.find();
        return questions;

    }
    catch (error)
    {
        throw error;
    }
}



const getQuestionById = async(id) =>
{
    try
    {
        const question = await Question.findById(id);
        if(!question)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }
        return question;
    }
    catch (error)
    {
        throw error;
    }
}


const updateQuestion = async(id, updateData) =>
{
    try
    {
        const question = await Question.findById(id);
        if(!question)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }

        question.editStatus = 
        {
            editedAt : new Date(),
            content : question.content,  
        }
        await question.set(updateData);
        await question.save();
        return question;
    }
    catch (error)
    {
        throw error;
    }
}


const deleteQuestion = async(id) =>
{
    try
    {
        const question = await Question.findById(id);
        if(!question)
        {
            const err = new Error();
            err.statusCode = 404;
            err.message = "Bai viet khong ton tai";
            throw err;
        }

        // question.status = "deleted";
        // await question.save();
        await Question.deleteOne({_id: id});
        return question;
    }
    catch (error)
    {
        throw error;
    }
}

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};