/*
 * @param {number} id, challenge id
 * @param {object} file, file content to save
 */
const save = async (id, file) => {
  try {
    if (!file || !id) throw new Error('Undefined file')
    if (
      !file.fieldname ||
      !file.originalname ||
      !file.encoding ||
      !file.mimetype ||
      !file.buffer ||
      !file.size
    )
      throw new Error('Missing file fields')
    return await File.create(file)
  } catch (error) {
    console.error(error)
    return null
  }
}

const getAll = async () => {
  try {
    return await File.find({})
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports = {
  save,
  getAll
}
