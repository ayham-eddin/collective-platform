import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import type { LocalizedText, TeamMemberItem } from "../../types/team.types";

interface TeamCarouselProps {
  members: TeamMemberItem[];
  language: keyof LocalizedText;
  featuredLabel: string;
}

export const TeamCarousel = ({
  members,
  language,
  featuredLabel,
}: TeamCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const showPreviousMember = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? members.length - 1 : currentIndex - 1,
    );
  };

  const showNextMember = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === members.length - 1 ? 0 : currentIndex + 1,
    );
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <div className="relative mt-16 overflow-hidden py-10">
      {members.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPreviousMember}
            className="absolute left-3 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur transition hover:border-violet-400 hover:bg-violet-600 md:left-8"
            aria-label="Previous team member"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={showNextMember}
            className="absolute right-3 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur transition hover:border-violet-400 hover:bg-violet-600 md:right-8"
            aria-label="Next team member"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div className="relative mx-auto h-[760px] max-w-6xl md:h-[720px]">
        {members.map((member, index) => {
          const position = getCarouselPosition(
            index,
            activeIndex,
            members.length,
          );

          if (position === "hidden") {
            return null;
          }

          const isActive = position === "active";
          const roleText = getLocalizedText(member.role, language, "");
          const biographyText = getLocalizedText(
            member.biography,
            language,
            "",
          );

          return (
            <article
              key={member._id}
              onClick={() => {
                if (!isActive) {
                  setActiveIndex(index);
                }
              }}
              className={[
                "absolute left-1/2 top-0 w-[86%] max-w-[500px] -translate-x-1/2 overflow-hidden rounded-[2rem] border bg-white/[0.04] text-left shadow-2xl shadow-black/30 transition-all duration-500",
                isActive
                  ? "z-20 scale-100 border-violet-400/60 opacity-100"
                  : "z-10 cursor-pointer scale-[0.78] border-white/10 opacity-35 grayscale hover:opacity-55",
                position === "left" ? "-translate-x-[128%]" : "",
                position === "right" ? "translate-x-[28%]" : "",
              ].join(" ")}
            >
              <div className="relative min-h-[460px] overflow-hidden bg-zinc-900 md:min-h-[500px]">
                {member.image ? (
                  <img
                    src={member.image.url}
                    alt={member.fullName}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="grid min-h-[460px] place-items-center text-zinc-500 md:min-h-[500px]">
                    {member.fullName}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                {member.isFeatured && (
                  <span className="absolute left-5 top-5 rounded-full bg-violet-600 px-4 py-2 text-xs font-black uppercase text-white">
                    {featuredLabel}
                  </span>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-lg font-bold italic text-violet-300">
                    {roleText}
                  </p>

                  <h3 className="mt-2 text-4xl font-black tracking-tight text-white">
                    {member.fullName}
                  </h3>
                </div>
              </div>

              <div className="min-h-[220px] p-7">
                {biographyText && (
                  <p className="line-clamp-4 leading-7 text-zinc-400">
                    {biographyText}
                  </p>
                )}

                {(member.email ||
                  member.instagramUrl ||
                  member.facebookUrl ||
                  member.linkedinUrl) && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className={socialLinkClass}
                        aria-label={`Email ${member.fullName}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Mail size={18} />
                      </a>
                    )}

                    {member.instagramUrl && (
                      <a
                        href={member.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={socialLinkClass}
                        aria-label={`Instagram ${member.fullName}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <FaInstagram size={18} />
                      </a>
                    )}

                    {member.facebookUrl && (
                      <a
                        href={member.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={socialLinkClass}
                        aria-label={`Facebook ${member.fullName}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <FaFacebookF size={18} />
                      </a>
                    )}

                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={socialLinkClass}
                        aria-label={`LinkedIn ${member.fullName}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <FaLinkedinIn size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {members.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {members.map((member, index) => (
            <button
              key={member._id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                "h-2.5 rounded-full transition-all",
                index === activeIndex
                  ? "w-10 bg-violet-500"
                  : "w-2.5 bg-white/25 hover:bg-white/50",
              ].join(" ")}
              aria-label={`Go to team member ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const getCarouselPosition = (
  index: number,
  activeIndex: number,
  totalItems: number,
) => {
  if (index === activeIndex) {
    return "active";
  }

  const previousIndex = activeIndex === 0 ? totalItems - 1 : activeIndex - 1;
  const nextIndex = activeIndex === totalItems - 1 ? 0 : activeIndex + 1;

  if (index === previousIndex) {
    return "left";
  }

  if (index === nextIndex) {
    return "right";
  }

  return "hidden";
};

const getLocalizedText = (
  value: LocalizedText | undefined,
  language: keyof LocalizedText,
  fallback: string,
) => {
  return value?.[language] || value?.de || fallback;
};

const socialLinkClass =
  "grid h-11 w-11 place-items-center rounded-full border border-white/15 text-zinc-400 transition hover:border-violet-400 hover:bg-violet-500 hover:text-white";
