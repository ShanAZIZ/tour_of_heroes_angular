import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'content-type': 'application/json'})
  };

  constructor(private messageService: MessageService, private http: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    // this.http.get<Hero[]>(this.heroesUrl).subscribe((value) => { console.log(value); });
  	return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')), 
        catchError(this.handleError<Hero[]>('getHeroes',  [])));
  }

  getHero(id: number): Observable<Hero> {
  	const url: string = this.heroesUrl+ "/" + id;
    return this.http.get<Hero>(url).
      pipe(
          tap(_=>this.log("Fetched hero id=" + id)),
          catchError(this.handleError<Hero>("getHero id="+id))
        );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
    .pipe(
        tap((newHero: Hero) => this.log("added hero w/ id=" + newHero.id)),
        catchError(this.handleError<Hero>("addHero"))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
    .pipe(
        tap(_ => this.log("Updated Hero id=" + hero.id)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = this.heroesUrl + "/" + id;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log("deleted Hero id=" + id)),
      catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  private log (message: string){
    this.messageService.add("HeroService : " + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(operation + " failed : " + error.message);
      return of(result as T);
    }
  }

}
