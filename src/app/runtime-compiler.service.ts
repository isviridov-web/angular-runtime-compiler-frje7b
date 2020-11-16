import { CommonModule } from "@angular/common";
import {
  Compiler,
  Component,
  Injectable,
  NgModule,
  NgModuleFactory,
  Type
} from "@angular/core";

export class DynamicTemplate {
  constructor(
    public readonly component: Type<any>,
    public readonly moduleFactory?: NgModuleFactory<any>
  ) {}
}

@Injectable({ providedIn: "root" })
export class RuntimeCompilerService {
  constructor(private readonly compiler: Compiler) {}

  public async createAndCompileTemplate(
    context: any,
    template: string
  ): Promise<DynamicTemplate> {
    const dynamicComponent = Component({ template })(
      class {
        constructor() {
          for (const prop of Object.keys(context)) {
            (this as any)[prop] = context[prop];
          }
        }
      }
    );

    const dynamicModule = NgModule({
      declarations: [dynamicComponent],
      entryComponents: [dynamicComponent],
      exports: [dynamicComponent],
      imports: [CommonModule]
    })(class DynamicModule {});

    const compiledModule = await this.compiler.compileModuleAndAllComponentsAsync(
      dynamicModule
    );
    console.log("CompiledModule: ", compiledModule);
    return new DynamicTemplate(
      dynamicComponent,
      compiledModule.ngModuleFactory
    );
  }
}
