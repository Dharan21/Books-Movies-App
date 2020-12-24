export class Movie {
  public hasDetails = false;
  public isAdult: boolean;
  public genres: string[];
  public homepage: string;
  public productionCompanies: string[];
  public runtime: number;
  public status: string;
  public tagline: string;
  constructor(
    public id: number,
    public original_language: string,
    public original_title: string,
    public overview: string,
    public price: number,
    public poster_path: string,
    public release_date: Date,
    public title: string,
    public imdb: number,
    public quantity: number
  ) { }
}
