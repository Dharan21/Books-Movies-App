export class Book {
  public hasDetails = false;
  public publisher: string;
  public subtitle: string;
  public numberOfPages: number;
  public subject: string;
  public publishDate: Date;
  public overview: string;
  public authors: string[];
  constructor(
    public title: string,
    public isbn13: string,
    public price: number,
    public image: string,
    public url: string,
    public quantity: number
  ) { }
}
