export abstract class validationRepository
{
    abstract isNull(value : string);
    abstract emailValidFormat(value : string);
    abstract passwordValidFormat(value : string);
    abstract namesValidFormat(value : string);
    abstract dniValidFormat(value : string);
    abstract rolValidFormat(value : string);
}