import ExceptionRepository from "src/domain/Exceptions/Repository/ExceptionRepository";
import { UserException } from "../Adapters/UserException";

export const MergeExceptionRepository = {
    provide: ExceptionRepository,
    useClass: UserException
}