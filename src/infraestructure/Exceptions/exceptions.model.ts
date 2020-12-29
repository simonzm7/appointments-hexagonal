import { Module } from "@nestjs/common";
import { MergeExceptionRepository } from "./MergeProviders/MergeProviders";

@Module({
    providers: [MergeExceptionRepository]
    ,exports: [MergeExceptionRepository]
})
export class ExceptionModel {}