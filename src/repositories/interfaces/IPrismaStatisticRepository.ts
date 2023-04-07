export interface IPrismaStatisticRepository {
  create(props: { urlId: string; userAgent: string }): Promise<void>;
}
