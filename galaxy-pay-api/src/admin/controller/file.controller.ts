import { Body, Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { createWriteStream } from 'fs'
import * as path from 'path'

@Controller('file')
export class FileController {
  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@Body() body, @UploadedFile() file) {
    const fileType = file.mimetype.split('/')[1]
    if (fileType !== 'x-pkcs12' && fileType !== 'x-x509-ca-cert') {
      throw new HttpException('文件格式不正确！', HttpStatus.BAD_REQUEST)
    }
    const suffixType = file.originalname.split('.')[1]
    // 这里捕获错误，因为上传可能有各种各样的未知原因报错
    try {
      const fileName = `${body.fileName}_${Date.parse(Date())}.${suffixType}`
      const writeFile = createWriteStream(path.join(__dirname, '../../../', 'upload', fileName))
      writeFile.write(file.buffer)
      return {
        path: `/upload/${fileName}`,
        size: file.size,
        mimetype: file.mimetype
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    }
  }
}
