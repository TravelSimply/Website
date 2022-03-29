import axios from 'axios'

export async function uploadImage(file:File) {

    const formData = new FormData()
    formData.append('file', file)

    const {data} = await axios({
        method: 'POST',
        url: '/api/users/profile/change-image',
        data: formData
    })

    return data
}