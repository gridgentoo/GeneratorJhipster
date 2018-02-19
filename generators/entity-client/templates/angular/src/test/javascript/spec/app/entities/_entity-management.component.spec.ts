<%#
 Copyright 2013-2018 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see http://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
<%_
const tsKeyId = generateTestEntityId(pkType, prodDatabaseType);
_%>
/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
<%_ if (pagination !== 'no') { _%>
import { ActivatedRoute, Data } from '@angular/router';
<%_ } _%>

import { <%=angularXAppName%>TestModule } from '../../../<%= entityParentPathAddition %>test.module';
import { <%= entityAngularName %>Component } from 'app/entities/<%= entityFolderName %>/<%= entityFileName %>.component';
import { <%= entityAngularName %>Service } from 'app/entities/<%= entityFolderName %>/<%= entityFileName %>.service';
import { <%= entityAngularName %> } from 'app/shared/model/<%= entityModelFileName %>.model';

describe('Component Tests', () => {
    describe('<%= entityAngularName %> Management Component', () => {
        let comp: <%= entityAngularName %>Component;
        let fixture: ComponentFixture<<%= entityAngularName %>Component>;
        let service: <%= entityAngularName %>Service;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [<%=angularXAppName%>TestModule],
                declarations: [<%= entityAngularName %>Component],
                providers: [
                    <%= entityAngularName %>Service<% if (pagination !== 'no') { %>, {
                    provide: ActivatedRoute,
                    useValue: {
                        data: {
                            subscribe: (fn: (value: Data) => void) => fn({pagingParams: {
                                        predicate: 'id',
                                        reverse: false,
                                        page: 0
                                    }
                                })
                            }
                        }
                    }<% } %>
                ]
            })
            .overrideTemplate(<%= entityAngularName %>Component, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(<%= entityAngularName %>Component);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(<%= entityAngularName %>Service);
        });

        it('Should call load all on init', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                body: [new <%= entityAngularName %>(<%- tsKeyId %>)],
                headers
            })));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.<%= entityInstancePlural %>[0]).toEqual(jasmine.objectContaining({id: <%- tsKeyId %>}));
        });
    <%_ if (pagination !== 'no') { _%>

        it('should load a page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                Observable.of(
                    new HttpResponse({
                        body: [new <%= entityAngularName %>(<%- tsKeyId %>)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);

            // THEN
            expect(service.query).toHaveBeenCalled();
            expect(comp.<%= entityInstancePlural %>[0]).toEqual(jasmine.objectContaining({id: <%- tsKeyId %>}));
        });
        <%_ if (pagination !== 'infinite-scroll') { _%>

        it('should not load a page is the page is the same as the previous page', () => {
            spyOn(service, 'query').and.callThrough();

            // WHEN
            comp.loadPage(0);

            // THEN
            expect(service.query).toHaveBeenCalledTimes(0);
        });
        <%_ } _%>

        it('should re-initialize the page', () => {
            // GIVEN
            const headers = new HttpHeaders().append('link', 'link;link');
            spyOn(service, 'query').and.returnValue(
                Observable.of(
                    new HttpResponse({
                        body: [new <%= entityAngularName %>(<%- tsKeyId %>)],
                        headers
                    })
                )
            );

            // WHEN
            comp.loadPage(1);
            <%_ if (pagination === 'infinite-scroll') { _%>
            comp.reset();
            <%_ } else { _%>
            comp.clear();
            <%_ } _%>

            // THEN
            expect(comp.page).toEqual(0);
            expect(service.query).toHaveBeenCalledTimes(2);
            expect(comp.<%= entityInstancePlural %>[0]).toEqual(jasmine.objectContaining({id: <%- tsKeyId %>}));
        });
        <%_ if (pagination === 'infinite-scroll') { _%>
        it('should calculate the sort attribute for an id', () => {
            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['id,asc']);
        });

        it('should calculate the sort attribute for a non-id attribute', () => {
            // GIVEN
            comp.predicate = 'name';

            // WHEN
            const result = comp.sort();

            // THEN
                expect(result).toEqual(['name,asc', 'id']);
        });
        <%_ } else { _%>
        it('should calculate the sort attribute for an id', () => {
            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['id,desc']);
        });

        it('should calculate the sort attribute for a non-id attribute', () => {
            // GIVEN
            comp.predicate = 'name';

            // WHEN
            const result = comp.sort();

            // THEN
            expect(result).toEqual(['name,desc', 'id']);
        });
        <%_ } _%>
    <%_ } _%>
    });
});
