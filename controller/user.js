const User = require ('../model/user');

const createUser = async (userData) =>
{
    try 
    {
        
        const user =  new User(userData)
        const avaiable = await User.findOne({username: userData.username});
        if (!avaiable)
        {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(userData.email)) 
            {
                throw new error("Not valid email!");
            }
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            user.password = hashedPassword;
            await user.save();
            return user;
        }
        else throw new error("User already exists!");  
    } 
    catch (error) 
    {
        throw error;    
    }
}

const getUsers = async () =>
{
    try 
    {
        const user = await User.find();
        return user;    
    } 
    catch (error) 
    {
        throw error;    
    }
}

const getUserById = async (id) =>
{
    try 
    {
        const user = await User.findById({id});
        if(!user) throw new Error('User not found!');
        return user;    
    } 
    catch (error) 
    {
        throw error;    
    }
}

const getUserByUsername = async (username) =>
{
    try 
    {
        const user = await User.findOne({username});
        if(!user) throw new Error('User not found!');
        return user;    
    } 
    catch (error) 
    {
        throw error;    
    }
}

const getUserByEmail = async (email) =>
{
    try 
    {
        const user = await User.findOne({email});
        if(!user) throw new Error('User not found!');
        return user;    
    } 
    catch (error) 
    {
        throw error;    
    }
}


const updateUser = async (user, updateData) =>
{
    try 
    {
        user.set(updateData);
        await user.save();
        return user;
    } 
    catch (error) 
    {
        throw error;    
    }
}

const deleteUser = async (user) =>
{
    try 
    {
        user.status = 'deleted';
        await user.save();  
        return user;
    }   
    catch (error) 
    {
        throw error;    
    }
}

module.exports = {createUser, getUsers, getUserById, getUserByUsername, getUserByEmail, updateUser, deleteUser};