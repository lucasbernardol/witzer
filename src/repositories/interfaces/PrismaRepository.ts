export type Url = {
  id?: string;
  href: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUrlProps = Pick<Url, 'hash' | 'href'>;

export interface PrismaRepository {
  create(props: CreateUrlProps): Promise<Url>;
}
