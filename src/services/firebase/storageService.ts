import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from './firebaseConfig'

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]+/g, '-')

export async function uploadContractDocument(userId: string, file: File) {
  const filePath = `contracts/${userId}/${Date.now()}-${sanitizeFileName(file.name)}`
  const storageRef = ref(storage, filePath)
  await uploadBytes(storageRef, file, {
    contentType: file.type || 'application/octet-stream',
  })

  const fileUrl = await getDownloadURL(storageRef)

  return {
    filePath,
    fileUrl,
  }
}
