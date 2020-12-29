export interface IMethods
{
    IsEmail();
    IsLength(conditions : { min : number, max : number});
    IsString();
    IsNumber();
    IsRole();
}