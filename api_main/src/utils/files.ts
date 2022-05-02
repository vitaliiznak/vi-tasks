import fs from 'fs'
import path from 'path'
import { PassThrough } from 'stream'
import fileTypeStream from 'file-type-stream'
import { v4 as uuidv4 } from 'uuid'
import streamToPromise from 'stream-to-promise'

declare let require: {
  main: {
    filename: string;
  };
}

export const UPLOAD_PATH = path.resolve(
  path.dirname(require.main.filename),
  '../uploads',
)
export const saveFileList = async (filesList: Array<{
  originFileObj: Promise<{
    // eslint-disable-next-line @typescript-eslint/ban-types
    createReadStream: Function
    filename: string,
    mimetype: string,
    encoding: string
  }>
}>) => {
  return Promise.all(
    filesList.map(async ({ originFileObj }) => {
      const {
        createReadStream,
        filename,
        mimetype,
        encoding,
      } = await originFileObj
      const Body = new PassThrough()
      const stream = createReadStream()
      const { ext } = (await new Promise((resolve) => stream.pipe(fileTypeStream(resolve)).pipe(Body)))
      const prefix = uuidv4()
      const uri = `${prefix}_${filename}`
      const pathToStore = path.join(UPLOAD_PATH, uri)
      const writeToFileStream = fs.createWriteStream(pathToStore, {
        flags: 'w',
      })

      createReadStream().pipe(writeToFileStream)
      await streamToPromise(writeToFileStream)
      return {
        uri,
        filename,
        mimetype,
        encoding,
        ext,
      }
    }),
  )
}
