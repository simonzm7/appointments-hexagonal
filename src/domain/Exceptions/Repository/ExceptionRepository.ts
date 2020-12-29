export default abstract class ExceptionRepository {
    abstract createException(message : any, statusCode : number);
}