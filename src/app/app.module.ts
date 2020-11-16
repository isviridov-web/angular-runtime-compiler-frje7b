import {
  Compiler,
  CompilerFactory,
  CompilerOptions,
  COMPILER_OPTIONS,
  NgModule,
  ViewEncapsulation
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { JitCompilerFactory } from "@angular/platform-browser-dynamic";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";

const compilerOpts: CompilerOptions = {
  defaultEncapsulation: ViewEncapsulation.None,
  useJit: true
};

const createCompiler = (
  compilerFactory: CompilerFactory,
  options: CompilerOptions[]
): Compiler => compilerFactory.createCompiler(options);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [
    { provide: COMPILER_OPTIONS, useValue: compilerOpts, multi: true },
    {
      provide: CompilerFactory,
      useClass: JitCompilerFactory,
      deps: [COMPILER_OPTIONS]
    },
    {
      provide: Compiler,
      useFactory: createCompiler,
      deps: [CompilerFactory, COMPILER_OPTIONS]
    }
  ]
})
export class AppModule {}
