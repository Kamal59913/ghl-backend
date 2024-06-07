import bcrypt from "bcrypt";

export const isPassWordCorrect = async (password, currentPassword) => {
    return await bcrypt.compare(currentPassword, password)
}