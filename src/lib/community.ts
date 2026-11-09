/**
 * Public community surfaces stay off until two things exist:
 * explicit consent on every submission, and a way to report or remove a card.
 * Gem Wall, Gem of the Day, Gem Twins, Weekly Gems, Gem Collection,
 * Daily Question, and Community Spotlight should all call this guard.
 */
export const PUBLIC_SUBMISSIONS_ENABLED = false;

export interface PublicSubmissionConsent {
  displayOnWall: boolean;
  consentedAt: string;
}

export function canPublishPublicly(
  consent: PublicSubmissionConsent | null,
): boolean {
  return PUBLIC_SUBMISSIONS_ENABLED && consent?.displayOnWall === true;
}
