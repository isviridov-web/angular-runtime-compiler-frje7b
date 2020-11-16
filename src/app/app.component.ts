import { Component, AfterViewInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import {
  DynamicTemplate,
  RuntimeCompilerService
} from "./runtime-compiler.service";

interface IDynamicTemplateComponent {
  context: any;
  template: string;
}

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit {
  public readonly dynamicTemplate$: Observable<DynamicTemplate>;
  private readonly _template: Subject<IDynamicTemplateComponent>;

  constructor(private runtimeCompilerService: RuntimeCompilerService) {
    this._template = new Subject<IDynamicTemplateComponent>();

    this.dynamicTemplate$ = this._template.pipe(
      switchMap(({ context, template }) =>
        this.runtimeCompilerService.createAndCompileTemplate(context, template)
      )
    );
  }

  ngAfterViewInit() {
    const context = {
      record: {
        name: "Ivan Test"
      }
    };
    const template = `<span class="record_name"> {{record | json}}{{ record.name }}</span>                                                 
                                            <br>                                                                                        <div *ngIf="record.name; then fbsxrnfhhzxk else dupnmeebjujk"></div>
                                                <ng-template #fbsxrnfhhzxk="">                                                                                                         quote has name                                                </ng-template>
                                                <ng-template #dupnmeebjujk="">                                                                                                         quote has no name                                                </ng-template>                                                                        <br>`;

    this._template.next({ context, template });
  }
}
