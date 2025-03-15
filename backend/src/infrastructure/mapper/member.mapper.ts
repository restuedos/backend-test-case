import { Member } from '../../domain/entities/member.entity';
import { BorrowedBook } from '../../domain/entities/borrow.entity';
import {
  Member as PrismaMember,
  BorrowedBook as PrismaBorrowedBook,
} from '@prisma/client';

export class MemberMapper {
  static toDomain(
    member: PrismaMember & { borrowedBooks: PrismaBorrowedBook[] },
  ): Member {
    const domainMember = new Member(
      member.id,
      member.code,
      member.name,
      member.penaltyUntil ?? undefined,
    );

    member.borrowedBooks.forEach((book) => {
      domainMember.borrowBook(
        new BorrowedBook(
          book.id,
          book.code,
          book.memberCode,
          book.bookCode,
          book.borrowedAt,
          book.returnedAt ?? undefined,
        ),
      );
    });

    return domainMember;
  }
}
