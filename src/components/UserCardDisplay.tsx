import { Show, createEffect, createSignal } from "solid-js";
import type { UserDTOWithVotesAndCards } from "../../utils/apiTypes";
import CardMetadataDisplay from "./CardMetadataDisplay";
import { PaginationController } from "./Atoms/PaginationController";
import { CollectionUserPageView } from "./CollectionUserPageView";

const [user, setUser] = createSignal<UserDTOWithVotesAndCards>();

export const UserCardAmountDisplay = () => {
  return (
    <div class="flex w-full justify-start">
      <Show when={user() != null}>
        {(
          user() as UserDTOWithVotesAndCards
        ).total_cards_created.toLocaleString()}
      </Show>
    </div>
  );
};
export const UserCardDisplay = (props: { id: string; page: number }) => {
  let apiHost = import.meta.env.PUBLIC_API_HOST;

  createEffect(() => {
    void fetch(`${apiHost}/user/${props.id}/${props.page}`, {
      method: "GET",
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        void response.json().then((data) => {
          setUser(data);
          console.log(data);
        });
      }
    });
  });

  return (
    <Show when={user() != null}>
      <div class="mx-auto grid w-fit grid-cols-[1fr,2fr] justify-items-end gap-x-2 gap-y-2 text-end sm:gap-x-4">
        {(user() as UserDTOWithVotesAndCards).website && (
          <>
            <div class="font-semibold">Website:</div>
            <a
              href={(user() as UserDTOWithVotesAndCards).website as string}
              target="_blank"
              class="line-clamp-1 flex w-full justify-start text-magenta-500 underline dark:text-turquoise-400"
            >
              {(user() as UserDTOWithVotesAndCards).website}
            </a>
          </>
        )}
        {(user() as UserDTOWithVotesAndCards).email &&
          (user() as UserDTOWithVotesAndCards).visible_email && (
            <>
              <div class="font-semibold">Email:</div>
              <div class="flex w-full justify-start break-all">
                {(user() as UserDTOWithVotesAndCards).email}
              </div>
            </>
          )}
        <div class="font-semibold">Cards Created:</div>
        <UserCardAmountDisplay />
        <div class="font-semibold">Cumulative Rating:</div>
        <div class="flex w-full justify-start">
          {(
            (user() as UserDTOWithVotesAndCards).total_upvotes_received -
            (user() as UserDTOWithVotesAndCards).total_downvotes_received
          ).toLocaleString()}
        </div>
        <div class="font-semibold">Votes Cast:</div>
        <div class="flex w-full justify-start">
          {(
            user() as UserDTOWithVotesAndCards
          ).total_votes_cast.toLocaleString()}
        </div>
        <div class="font-semibold">Date Created:</div>
        <div class="flex w-full justify-start">
          {new Date(
            (user() as UserDTOWithVotesAndCards).created_at,
          ).toLocaleDateString()}
        </div>
      </div>
      <div class="mb-4 mt-4 flex flex-col border-t border-neutral-500 pt-4 text-xl">
        <CollectionUserPageView user={user() as UserDTOWithVotesAndCards} />
      </div>
      <div class="mb-4 mt-4 flex flex-col border-t border-neutral-500 pt-4 text-xl">
        <span>Cards Created by</span>{" "}
        <span class="break-all font-bold">
          {(user() as UserDTOWithVotesAndCards).username ||
            (user() as UserDTOWithVotesAndCards).email}
        </span>
      </div>
      <div class="flex w-full flex-col space-y-4">
        <div class="flex w-full flex-col space-y-4">
          {(user() as UserDTOWithVotesAndCards).cards.map((card) => (
            <div class="w-full">
              <CardMetadataDisplay card={card} />
            </div>
          ))}
        </div>
      </div>
      <div class="mx-auto my-12 flex items-center justify-center space-x-2">
        <PaginationController
          prefix="?"
          query={`/user/${(user() as UserDTOWithVotesAndCards).id}`}
          page={props.page}
          totalPages={Math.ceil(
            (user() as UserDTOWithVotesAndCards).total_cards_created / 25,
          )}
        />
      </div>
    </Show>
  );
};