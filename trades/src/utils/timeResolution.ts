import { ResolutionString } from '../tvchart/charting_library';

export function getBarTimeSeconds(
  tradeTimeSeconds: number,
  resolution: ResolutionString
): number {
  let resolutionMinutes = parseInt(resolution);

  // If the 'parseInt' function returned NaN that means the resolution didn't contain a number, like 'D', so consider 1
  if (isNaN(resolutionMinutes)) {
    resolutionMinutes = 1;
  }

  // Resolution with no unit is considered to be minutes
  if (isNaN(Number(resolution))) {
    switch (resolution.toLowerCase().charAt(resolution.length - 1)) {
      case 'h':
        resolutionMinutes = resolutionMinutes * 60;
        break;
      case 'd':
        resolutionMinutes = resolutionMinutes * 24 * 60;
        break;
      case 'w':
        resolutionMinutes = resolutionMinutes * 7 * 24 * 60;
        break;
      case 'm':
        resolutionMinutes = resolutionMinutes * 30 * 24 * 60;
        break;
      default:
        throw new Error('Resolution not supported ' + resolution);
    }
  }

  return truncateTime(resolutionMinutes, tradeTimeSeconds);
}

function truncateTime(resolutionMinutes: number, tradeTime: number) {
  const barSeconds = resolutionMinutes * 60;
  return Math.floor(tradeTime / barSeconds) * barSeconds;
}
