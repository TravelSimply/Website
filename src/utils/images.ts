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

export async function uploadTempImage(file:File, allPublicIds:string[], publicIdToModify?:string) {

    const formData = new FormData()
    formData.append('file', file)
    formData.append('allPublicIds', allPublicIds.join(' '))
    if (publicIdToModify) {
        formData.append('publicIdToModify', publicIdToModify)
    }

    const {data} = await axios({
        method: 'POST',
        url: '/api/users/upload/temp-image',
        data: formData
    })

    return data
}