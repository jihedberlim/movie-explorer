import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PersonDetails } from '../../core/models/person.model';
import { Person } from './person';

describe('Person', () => {
  const apiUrl = environment.tmdbApiUrl;
  let fixture: ComponentFixture<Person>;
  let httpTesting: HttpTestingController;

  function createPerson(fields: Partial<PersonDetails> = {}): PersonDetails {
    return {
      id: 10297,
      name: 'Matthew McConaughey',
      biography: 'American actor.',
      birthday: '1969-11-04',
      deathday: null,
      place_of_birth: 'Uvalde, Texas, USA',
      profile_path: '/photo.jpg',
      combined_credits: {
        cast: [
          {
            id: 157336,
            title: 'Interstellar',
            overview: '',
            poster_path: '/poster.jpg',
            backdrop_path: null,
            vote_average: 8.5,
            popularity: 90,
            media_type: 'movie',
            character: 'Cooper',
          },
        ],
      },
      translations: { translations: [] },
      ...fields,
    };
  }

  async function open(person: PersonDetails): Promise<HTMLElement> {
    fixture.componentRef.setInput('id', String(person.id));
    TestBed.tick(); // lets the resource start the request
    httpTesting.expectOne((r) => r.url === `${apiUrl}/person/${person.id}`).flush(person);
    await fixture.whenStable();
    return fixture.nativeElement;
  }

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Person],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Person);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should show the name, birthday, place of birth and biography', async () => {
    const page = await open(createPerson());

    expect(page.querySelector('h1')?.textContent).toContain('Matthew McConaughey');
    expect(page.textContent).toContain('November 4, 1969');
    expect(page.textContent).toContain('Uvalde, Texas, USA');
    expect(page.textContent).toContain('American actor.');
  });

  it('should list the titles the person worked on, linking to their details', async () => {
    const page = await open(createPerson());

    const card = page.querySelector('app-movie-card a');
    expect(card?.textContent).toContain('Interstellar');
    expect(card?.getAttribute('href')).toBe('/movie/157336');
  });

  it('should show a message when there is no biography in any language', async () => {
    const page = await open(createPerson({ biography: '' }));

    expect(page.textContent).toContain('No biography available.');
  });

  it('should cut a long biography and show it all after "Read more"', async () => {
    const page = await open(createPerson({ biography: 'Long text. '.repeat(100) }));
    const biography = page.querySelector('p.line-clamp-6');
    expect(biography).not.toBeNull();

    page.querySelector<HTMLButtonElement>('section button')!.click();
    await fixture.whenStable();

    expect(page.querySelector('p.line-clamp-6')).toBeNull();
    expect(page.querySelector('section button')?.textContent).toContain('Show less');
  });
});
