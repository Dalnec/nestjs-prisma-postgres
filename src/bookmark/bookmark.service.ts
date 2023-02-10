import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.bookmark.findMany({ where: { userId } });
  }

  findOne(userId: number, id: number) {
    return this.prisma.bookmark.findFirst({ where: { id, userId } });
  }

  async create(userId: number, createBookmarkDto: CreateBookmarkDto) {
    return await this.prisma.bookmark.create({
      data: { userId, ...createBookmarkDto },
    });
  }

  async update(
    userId: number,
    id: number,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: id,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: {
        id: id,
      },
      data: {
        ...updateBookmarkDto,
      },
    });
  }

  async remove(userId: number, id: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: id,
      },
    });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: {
        id: id,
      },
    });
  }
}
