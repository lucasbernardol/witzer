export type Url = {
  id?: string;
  href: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUrlProps = Pick<Url, 'hash' | 'href'>;

export type hasByHashProps = Pick<Url, 'id' | 'href'>;

export interface IPrismaUrlRepository {
  create(props: CreateUrlProps): Promise<Url>;
  hasById(id: string): Promise<{ id: string } | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Url | null>;
  findMany(props: {
    current: number;
    take: number;
  }): Promise<{ shorts: Url[]; meta: Record<string, any> }>;
  update(id: string, props: Pick<Url, 'href'>): Promise<Url>;
  hasByHash(hash: string): Promise<hasByHashProps | null>;
}
