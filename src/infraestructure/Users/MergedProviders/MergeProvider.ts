import { DBRepository } from 'src/domain/Users/repositories/DB/DBRepository';
import { ValidationsRepository } from 'src/domain/Users/repositories/Validations/ValidationsRepository';
import { abstractUser } from '../../../domain/Users/repositories/Users/abstractUser';
import { DBAdapter } from '../adapters/DBAdapter';
import { UserAdapter } from '../adapters/UserAdapter';
import ValidationsAdapter from '../adapters/ValidationsAdapter';

export const MergeProvider = {
    provide: abstractUser,
    useClass: UserAdapter
}

export const MergeValidations = {
    provide: ValidationsRepository,
    useClass: ValidationsAdapter
}

export const MergeDB = {
    provide: DBRepository,
    useClass: DBAdapter
}
