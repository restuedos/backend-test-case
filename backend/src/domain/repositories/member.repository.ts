import { Member } from '../../domain/entities/member.entity';

export interface IMemberRepository {
  getAllMembers(): Promise<Member[]>;
  getMemberByCode(code: string): Promise<Member | null>;
  createMember(code: string, name: string): Promise<Member>;
  updateMember(code: string, name: string): Promise<Member>;
  deleteMember(code: string): Promise<void>;
  findMemberWithBorrowedBooks(memberCode: string): Promise<Member | null>;
  generateMemberCode(): Promise<string>;
}
