import axios, { AxiosError } from 'axios'

export async function uploadFileWithPresignedUrl(uploadedFile: File, presignedUrl: string): Promise<void> {
  try {
    console.time('uploadStart')
    const s3AxiosInstance = axios.create({
      withCredentials: false,
      timeout: 120000
    })
    await s3AxiosInstance.put(presignedUrl, uploadedFile, {
      headers: { 'Content-Type': uploadedFile.type },
    })
    // await axios.request({method: 'PUT', timeout: 0, url: presignedUrl})
    console.timeEnd('uploadStart')
    return
  } catch (e) {
    errorHandler(e)
  }
}

function errorHandler(e: AxiosError) {
  console.error(e)
  if (e.response && e.response.statusText) {
    throw new Error(e.response.statusText)
  }
  throw new Error(`${e}`)
}