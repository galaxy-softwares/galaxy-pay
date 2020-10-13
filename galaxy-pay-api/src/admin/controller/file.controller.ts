import {Controller, HttpException, HttpStatus, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { createWriteStream } from "fs";
import * as path from 'path';

@Controller('file')
export class FileController {

    @Post('uploadP12')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
        const fileType = (file.mimetype).split("/")[1];

        if (fileType !== "x-pkcs12") {
            throw new HttpException('文件格式不正确！', HttpStatus.BAD_REQUEST);
        }
        // 这里捕获错误，因为上传可能有各种各样的未知原因报错
        try {
            const fileName = Date.parse(Date());
            const writeImage = createWriteStream(path.join(__dirname, '../../../', 'upload', `${fileName}.p12`))
            writeImage.write(file.buffer)
            return {
                path: `/upload/${fileName}.p12`,
                size: file.size,
                mimetype: file.mimetype
            }
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

}