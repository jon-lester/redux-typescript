# Redux test app

## Rationale

Write a very basic app, and get to know Redux a little better.

Secondary objective - investigate other React CSS techniques. (A lot of my recent work has been with JSS in the Material-UI framework, so I wanted to try something different!)

## Implementation

### Stage 1 - Getting it up and running

This not very beautiful app shows a list of people (loaded from https://jsonplaceholder.typicode.com/) and allows some limited interaction with the list.

The initial get-up-and-running version stored all application state in the base component, App.tsx, as standard React state, so that it could be retro-fitted with Redux.

The user can:

- Select a person
- Delete a person from the list
- Pretend to log in as the selected person
- Log out

There are some additional system actions which affect state:

- Load and update person data from the API
- Display a 'loading' message
- Stop displaying the loading message

I therefore had seven action/reducer pairs to account for as below, which I've chosen to split into two state slices - Data and System.

Data:

- Load the people list (State - a people array)
- Select a person (State - a selected-person property)
- Delete a person (No associated state, but updates the above array)

System:

- Pretend to log in (State - a logged-in-user name)
- Log out (Updates the above user name state)
- Turn on the loading message (State - a 'loading' boolean)
- Turn off the loading message (Updates the loading boolean)

The (initial) state shape looks like this:

    {
        appData: {
            users: [],
            selectedUser: null
        },
        appSystem: {
            loaded: false,
            userName: null
        }
    }

My slice types are defined in the two files `store/appDataTypes.ts` and `store/appSystemTypes.ts`. These each contain the interface definition for their appropriate state slice, and the types and interfaces that define the associated actions. Action creators are defined in `store/actionCreators.ts`.

Reducers are in `store/appDataReducers.ts` and `store/appSystemReducers.ts`, and are combined into a root reducer in `store/index.ts`. The root reducer is then passed into the store in `Index.tsx`'s call to `createStore()`.

The `App.tsx` component still acts as the container for the rest of the app, so is the only one which makes use of react-redux's `connect()` HOC for access to the store.

In stage 1, API access is done in `componentDidMount()` on `App.tsx`, and the appropriate action to update the user list is dispatched when its promise resolves. The next stage will be to look at the best practices for API access in redux and refactor accordingly.

At this point, although I've added the react-redux-starter package to the project, I'm purposely avoiding using any shortcuts it provides so that I can better understand the nuts and bolts of setting up the actions and reducers and the store.

#### Type Safety

An objective of this test app was to attempt to leverage TypeScript for type-safety for all state, reducers, actions, and so on. This turned out to be easier than expected - a link on the Redux site gave a huge headstart on setting up the types correctly: https://redux.js.org/recipes/usage-with-typescript

However - I later found out that the guide is not the whole story by any means - Redux provides various types to apply to its common structures, such as `Action<TypeOfAdditionalPayload>`, and `ActionCreator<ActionType>`. I highly recommend reading Redux's `index.d.ts` file to see what's there.

(To be fair, inference was doing a great job without explicit type definitions for many of the store's artifacts, which is likely the aim of the above guide, but it's worth knowing how things are defined either way.)

#### Type-safety for the dispatch map

I ran into one minor annoyance while following the above guide, which is that it was necessary to manually add the dispatch functions to the container component's props for them to be recognised by the type system and intellisense. This made it necessary to update the list of dispatch functions in two places - once inline with the `connect()` HOC, and once for the app's props interface.

I got around this by moving the dispatch map out of the `connect()` call and into a constant:

    const dispatchMap = {
        selectUser,
        deleteUser,
        loadUserData,
        endLoad,
        logout,
        loginUser
    }

I could then union the dispatchMap object's type with the React component's props type, and receive type-safety for the dispatch functions on the component props for free:

    interface IAppProps {
        companyName: string;
    }

    class App extends Component<IAppProps & AppState & typeof dispatchMap> {
        // ...etc
    }

All that then remains is to pass the now-separated dispatch map into `connect()`:

    export default connect(
        (state: AppState) => state,
        dispatchMap
    )(App);

However - this technique quickly became obsolete as I began integrating and applying types to my `redux-thunk` code - see stage 2.

#### The First Challenge

Nearing the end of stage 1 I ran into a problem. If I'm logged in as a given user, but then delete the user, I need to immediately log that user out. However - users are managed in my Data slice, but the login state is managed in my System slice. I therefore needed to somehow cause the Data reducer's `DELETE_USER` action to also dispatch an action to the System reducer.

This StackOverflow post provided two possible solutions: https://stackoverflow.com/questions/40900354/updating-state-managed-by-another-reducer

1. Modify the System reducer to also respond to the `DELETE_USER` action and update the System data store accordingly. I didn't like the idea of mixing my slice reducers to achieve this, but it was an option. It occurred to me that I could add a third reducer with access to the entire state for cross-cutting concerns, but that still wouldn't have been ideal.

2. Use `redux-thunk` to bind the two actions together into a new thunk-action, and call that instead. This seemed promising, and is a common way of dealing with side-effects in Redux (and of dealing with asynchronous actions, which I also needed to make use of later).

3. Or a potential third option, which would be to assume a design error in the way the stores are split, and move the appropriate state to facilitate this case. However - I was erring on the side of keeping the two slices separate for the purposes of this test project, as cross-slice concerns could quite easily be a legitimate requirement in a production app.

I decided to give `redux-thunk` a go.

## CSS Modules

I gave CSS modules (https://github.com/css-modules/css-modules) a go with this test app, as Create-React-App has support out-of-the-box.

Thoughts:

- The scoped approach is a nice thing and akin to JSS, in that unique class names are generated at build time, so there's no need to manage potential name clashes across different components and/or modules. (Although global properties are supported if needed.)

- In order to be compatible with TSX/JSX code, the class names must be camelCase, so it's not possible to use eg. BEM naming (http://getbem.com/introduction/). It felt a bit odd to have to go without hyphens and underscores while working in 'plain' .css files, but it's a sacrifice worth making given the scoped approach and other benefits.

- The composing feature is welcome, and a lot of the reason why I wanted something more than regular CSS. CSS modules allows you to extend class definitions from the same file, other files, or from global definitions as well.

- On the downside, CSS module imports lack type-safety in Create-React-App, as typings aren't generated by the default configuration (and this is unlikely to change, see https://github.com/facebook/create-react-app/issues/5677).

- However - at least one VS Code plugin supports intellisense for class names - https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules

- Interestingly, the above plugin seems to support conversion of kebab-case in the CSS file to camelCase in its intellisense. A quick test in a CRA project without any special configuration shows that this translation doesn't also take place at build time (ie. kebab-case properties in the CSS are not successfully associated with camelCase properties used in the TSX component), however it does indicate that there may be a way to achieve that!

Overall, for my current purposes I think I prefer JSS, and will probably experiment with including it into projects that aren't based on Material-UI. However - will give CSS modules a closer look when I'm next setting up a custom build, as it seems that some of the limitations I'm running into could be addressed by the right build configuration.