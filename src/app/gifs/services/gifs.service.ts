import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@enviroments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';


const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  console.log(gifs);
  return gifs;
}



@Injectable({
  providedIn: 'root'
})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading =  signal(false);

  private tredingPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 4));
    }

    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrtendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString =  JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrtendingGifs() {

    if(this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/trending`,{
      params:{
        api_key: environment.giphyApiKey,
        limit: '20',
        offset: this.tredingPage() * 20,
      }
    }).subscribe((resp) => {

      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update((currentGifs) => [... currentGifs, ...gifs]);
      this.tredingPage.update((page) => page + 1);
      this.trendingGifsLoading.set(false);

    });
  }

  searchGifs(query:string):Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${ environment.giphyUrl }/gifs/search`, {
      params:{
        api_key: environment.giphyApiKey,
        limit: '20',
        q: query,
      }
    })
    .pipe(
      map(( { data } ) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      //Historial
      tap((items) => {
        this.searchHistory.update((history) => ({
           ...history,
          [query.toLowerCase()]: items,
        }))
      })
    );
  }

  getHistoryGifs(query:string):Gif[]{
    return this.searchHistory()[query] ?? [];
  }

}
