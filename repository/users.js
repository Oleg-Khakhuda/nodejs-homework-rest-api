import User from "../model/user";

const findById = async (id) => {
    return await User.findById(id)
}

const findByEmail = async (email) => {
    return await User.findOne({email})
}

const create = async (body) => {
    const user = new User(body)
    return await user.save()
}

const updateToken = async (id, token) => {
    return await User.updateOne({_id: id}, {token})
}

const setSubscription = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription })
}

const updateAvatar = async (id, avatarUrl, idAvatarCloud = null) => {
  return await User.updateOne({ _id: id }, { avatarUrl, idAvatarCloud })
}

export default { findById, findByEmail, create, updateToken, setSubscription, updateAvatar }