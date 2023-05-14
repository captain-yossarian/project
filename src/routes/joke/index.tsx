import {
  component$,
  useSignal,
  useStylesScoped$,
  useTask$,
} from "@builder.io/qwik";
import STYLES from "./index.css?inline";
import {
  routeLoader$,
  routeAction$,
  Form,
  server$,
  zod$,
  z,
} from "@builder.io/qwik-city";

const UserSchema = zod$({
  firstName: z.string(),
  lastName: z.string(),
});

export const useAddUser = routeAction$(async (user,a) => {
  
  return {
    success: true,
    userID: 2,
  };
}, UserSchema);

export const useJokeVoteAction = routeAction$((props) => {
  // Leave it as an exercise for the reader to implement this.
  console.log("VOTE", props);
});

export const useDadJoke = routeLoader$(async () => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: "application/json" },
  });

  return (await response.json()) as {
    id: string;
    status: number;
    joke: string;
  };
});

export default component$(() => {
  const dadJokeSignal = useDadJoke();
  const favoriteJokeAction = useJokeVoteAction();
  const isFavoriteSignal = useSignal(false);


  useStylesScoped$(STYLES);

  useTask$(({ track }) => {
    track(() => isFavoriteSignal.value);
    server$(() => {
      console.log("FAVORITE (server)", isFavoriteSignal.value);
    })();
  });

  return (
    <section class="section bright">
      <p>{dadJokeSignal.value.joke}</p>
      <button
        onClick$={() => {
          isFavoriteSignal.value = !isFavoriteSignal.value;
        }}
      >
        {isFavoriteSignal.value ? "❤️" : "🤍"}
      </button>
      <Form action={favoriteJokeAction}>
        <input type="hidden" name="jokeID" value={dadJokeSignal.value.id} />
        <button name="vote" value="up">
          👍
        </button>
        <button name="vote" value="down">
          👎
        </button>
      </Form>
    </section>
  );
});
