import { ICellRendererParams } from 'ag-grid-community';
import { differenceInWeeks, isFuture } from 'date-fns';
import ReactGA from 'react-ga';

interface ILinkRenderer extends ICellRendererParams {
  title: string;
  youtube: string;
  onSongChange: (song: string) => void;
}

export const MarkRenderer: (params: ICellRendererParams) => HTMLElement = (
  params
) => {
  const element = document.createElement('span');
  const imageElement = document.createElement('img');
  imageElement.src = `mark/${params.value}.png`;
  imageElement.alt = 'icon';
  element.appendChild(imageElement);
  return element;
};

export const LinkRenderer: (params: ILinkRenderer) => HTMLElement = (
  params
) => {
  const element = document.createElement('span');
  if (params.youtube === '') {
    element.innerHTML = params.title;
  } else {
    const onEmbeddedClick: (e: MouseEvent) => void = (e) => {
      ReactGA.event({
        category: 'Video',
        action: 'View Embedded Video',
        label: params.youtube,
      });
      params.onSongChange(params.youtube);
      e.preventDefault();
    };
    const onExternalClick: (e: MouseEvent) => void = (e) => {
      ReactGA.event({
        category: 'Video',
        action: 'View External Video',
        label: params.youtube,
      });
    };

    // External link
    const extLink = document.createElement('a');
    extLink.href = `https://youtu.be/${params.youtube}`;
    extLink.rel = 'noopener noreferrer';
    extLink.target = '_blank';
    extLink.onclick = onExternalClick;
    extLink.title = 'View on YouTube';
    extLink.className = 'ext-link';
    const icon = document.createElement('i');
    icon.className = 'fa fa-external-link';
    extLink.appendChild(icon);

    // Embedded link
    const embeddedLink = document.createElement('a');
    embeddedLink.innerHTML = params.title;
    embeddedLink.href = '# ';
    embeddedLink.rel = 'noopener noreferrer';
    embeddedLink.onclick = onEmbeddedClick;

    element.appendChild(extLink);
    element.appendChild(embeddedLink);
  }
  return element;
};

export const DateRenderer: (params: ICellRendererParams) => HTMLElement = (
  params
) => {
  const element = document.createElement('div');
  element.className = 'date-col';
  const dateSpan = document.createElement('span');
  const date = params.value;
  if (!date) return element;
  const now = new Date();
  const isRecentTrack = differenceInWeeks(now, date) < 3 || isFuture(date);
  dateSpan.innerHTML = params.valueFormatted;
  element.appendChild(dateSpan);
  if (isRecentTrack) {
    dateSpan.className = 'recent-track';
    const icon = document.createElement('i');
    icon.className = 'fa fa-star';
    icon.setAttribute('aria-hidden', 'true');
    icon.title = 'Recent Track';
    element.appendChild(icon);
  }
  return element;
};
