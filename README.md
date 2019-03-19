# Redux test app

## Rationale

Write a very basic app, and get to know Redux a little better.

Secondary objective - investigate other React CSS techniques. (A lot of my recent work has been with JSS in the Material-UI framework, so I wanted to try something different!)

## Implementation

### Stage 1 - Getting up and running with Redux

This not very beautiful app shows a list of people (from [JSONPlaceholder](https://jsonplaceholder.typicode.com/)) and allows some limited interaction with the list.

I wrote the initial version to store all application state in `App.tsx` as standard React state, then went on to refactor it to use redux.

The user can:

- Select a person.
- Delete a person (from the in-memory state).
- Pretend to log in as the selected person.
- Log out.

There are some additional system actions which affect state:

- Load and update person data from the API.
- Display a 'loading' message.
- Stop displaying the loading message.

I therefore had seven action/reducer pairs to account for as below, which I chose to split into two state slices - Data and System.

Data:

- Load the people list (State - an array of IUser)
- Select a person (State - a selected-user property)
- Delete a person (No associated state, but updates the above array)

System:

- Pretend to log in (State - a logged-in-user name)
- Log out (Simply removes the logged-in-user and updates)
- Turn on the loading message (State - a 'loading' boolean)
- Turn off the loading message (Updates the loading boolean)

Therefore the initial redux state shape looked like this:

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

In stage 1, I left loading from the API in `componentDidMount()` on `App.tsx`, and just dispatched an action to update the UI when the API call's promise resolves. Stage two will involve looking at the best practices for API access in redux and refactoring accordingly.

At this point, although I've added the react-redux-starter package to the project, I'm purposely avoiding using any shortcuts it provides so that I can better understand the nuts and bolts of setting up the actions and reducers and the store.

#### Type Safety

An objective of this test app was to attempt to leverage TypeScript type-safety as far as possible. This turned out to be easier than expected - [a page from the Redux documentation](https://redux.js.org/recipes/usage-with-typescript) gives a huge headstart on setting up the types correctly.

However - I later found out that the guide is not the whole story - Redux provides various types to apply to its common structures such as `Action<TypeOfActionProperties>`, and `ActionCreator<TypeOfAction>`. I highly recommend reading Redux's `index.d.ts` file to see what's there.

(To be fair, inference was doing a great job without explicit type definitions, which is likely the aim of the guide linked above, but it's worth knowing how things are defined either way.)

#### Type-safety for the dispatch map

I ran into one minor annoyance while following the guide - it was necessary to manually add the dispatch map functions to the container component's props for them to be recognised by the type system and intellisense. This made it necessary to update the list of dispatch functions in two places - once inline with the `connect()` HOC, and once for the app's props interface.

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

[This StackOverflow post](https://stackoverflow.com/questions/40900354/updating-state-managed-by-another-reducer) provided two possible solutions:

1. Modify the System reducer to also respond to the `DELETE_USER` action and update the System data store accordingly. I didn't like the idea of mixing my slice reducers to achieve this, but it was an option. It occurred to me that I could add a third reducer with access to the entire state for cross-cutting concerns, but that still wouldn't have been ideal.

2. Use `redux-thunk` to bind the two actions together into a new thunk-action, and call that instead. This seemed promising, and is a common way of dealing with side-effects in Redux (and of dealing with asynchronous actions, which I also needed to make use of later).

3. Or a potential third option, which would be to assume a design error in the way the stores are split, and move the appropriate state to facilitate this case. However - I was erring on the side of keeping the two slices separate for the purposes of this test project, as cross-slice concerns could quite easily be a legitimate requirement in a production app.

I decided to give `redux-thunk` a go.

### Stage 2 - Adding Thunks

#### What's a Thunk?

Out of the box redux is synchronous. That is - when an action is dispatched, the reducer will run immediately and trigger prop updates before returning control. This isn't the best pattern for API access - it's better to asynchronously queue the update and keep the UI responsive until it resolves.

Additionally, the basic redux pattern with segregated state slices doesn't explicitly cater for actions which must operate on multiple slices, or which must aggregate dispatches to multiple other actions.

Enter `redux-thunk`. By default redux works with action creators which return action objects, which are then passed to one or more reducers. Thunk allows action creators to return functions to be executed, which have access to a `dispatch()` parameter for dispatching other actions, and a `getState()` parameter to provide access to the full store state. These functions can also return a promise, allowing asynchronous calls which will update the redux store as they resolve.

I found [this article by Dave Ceddia](https://daveceddia.com/what-is-a-thunk/) to be very useful when getting my head around this topic initially.

#### Type-Safety

Applying TypeScript type-safety to `redux-thunk` was something of a challenge initially - the type documentation isn't expansive, and it's left up to the community to provide worked examples, which are somewhat thin on the ground.

However, after a few hours' research on StackOverflow and various technical blogs I arrived at a configuration which worked well. The problem I was running into was in convincing TypeScript that the component wrapped in `connect()` had props of the correct type to be passed to the HOC. The key for me was to replace the shorthand dispatch map that I'd used in stage 1 with a correctly-typed function-form map - see [this documentation page](https://react-redux.js.org/using-react-redux/connect-mapdispatch#two-forms-of-mapdispatchtoprops) for details on the two map forms, and also see my notes in the source (it's necessary to use `any` as the action type when typing the map).

This immediately obsoleted my previous solution for typing the dispatch map, as it was now a function which returned an object instead of an object, but this was easily solved by making use of TypeScript's `ReturnType<T>` type, as follows:

    const dispatchMap = (dispatch: ThunkDispatch<AppState, any, any>) => ({
        // .. mapped items here
    });

    class App extends Component<IAppProps & AppState & ReturnType<typeof dispatchMap>> {
        // .. component code
    }

#### Implementing some Thunks

With the `redux-thunk` middleware added to the app and type-safety in place, I was able to implement two thunk actions.

##### Solving the Part 1 Problem

In part one I ran across a problem in which I needed to update two store slices for a single action - when a user was deleted I needed to make sure that the user was also logged out. This was solvable with a thunk action as follows:

    export const deleteUserAndVerifyLoggedOut:
        ActionCreator<ThunkAction<IDeleteUserAction, AppState, undefined, AppActionTypes>> =
        (id: number) =>
        (dispatch, getState) => {

            const state = getState();

            const candidateUsersWithId = state.appData.users.filter(u => u.id === id);
            let deletedUser;

            // try to locate the user with the given id
            // (this should never fail)
            if (candidateUsersWithId.length === 1) {
                deletedUser = candidateUsersWithId[0];
            }

            // if we located the user, find out if logged in
            if (deletedUser && state.appSystem.userName === deletedUser.name) {
                // if logged in, dispatch a logout
                dispatch({
                    type: LOGOUT
                });
            }

            // finally, dispatch a delete for the user in all cases
            return dispatch({
                type: DELETE_USER,
                id
            });
        }

Note that the thunk uses `getState()` to be able to examine who the currently-logged-in user is, and `dispatch()` to dispatch the existing `LOGOUT` action if necessary. It then carries on to dispatch the `DELETE_USER` action, which updates state as it did previously.

(This could of course be an asynchronous call per the below if it was really deleting users via an API.)

#### Making an asynchronous API call

I removed the API call from `componentDidMount()` and added a call to a new thunk action, as follows:

    export const refreshUserData: ActionCreator<ThunkAction<Promise<ILoadUserDataAction>, AppState, undefined, AppActionTypes>> =
        () =>
        dispatch => {
            dispatch(beginLoad());
            return getUsers().then(users => {
                dispatch(endLoad());
                return dispatch(loadUserData(users));
            });
        }

Again this thunk uses `dispatch()` to dispatch multiple actions - first setting the loading state, then making an API call, and on completion unsetting the loading state and updating the store with the newly-fetched user data.

For both thunks, store updates are still encapsulated in their respective reducers, but additional logic can decide what to dispatch and when.

In summary, thunks seem a powerful addition to redux, expanding the toolkit to cater for the types of pattern that are likely to be needed in a larger scale app.

## CSS Modules

I gave [CSS modules](https://github.com/css-modules/css-modules) a go with this test app, as Create-React-App has support out-of-the-box.

Thoughts:

- The scoped approach is a nice thing and akin to JSS, in that unique class names are generated at build time, so there's no need to manage potential name clashes across different components and/or modules. (Although global properties are supported if needed.)

- In order to be compatible with TSX/JSX code, the class names must be camelCase, so it's not possible to use eg. [BEM naming](http://getbem.com/introduction/). It felt a bit odd to have to go without hyphens and underscores while working in 'plain' .css files, but it's a sacrifice worth making given the scoped approach and other benefits.

- The composing feature is welcome, and a lot of the reason why I wanted something more than regular CSS. CSS modules allows you to extend class definitions from the same file, other files, or from global definitions as well.

- On the downside, CSS module imports lack type-safety in Create-React-App, as typings aren't generated by the default configuration (and [this is unlikely to change](https://github.com/facebook/create-react-app/issues/5677)).

- However - [at least one](https://marketplace.visualstudio.com/items?itemName=clinyong.vscode-css-modules) VS Code plugin supports intellisense for class names.

- Interestingly, the above plugin seems to support conversion of kebab-case in the CSS file to camelCase in its intellisense. A quick test in a CRA project without any special configuration shows that this translation doesn't also take place at build time (ie. kebab-case properties in the CSS are not successfully associated with camelCase properties used in the TSX component), however it does indicate that there may be a way to achieve that!

Overall, for my current purposes I think I prefer JSS right now, and will probably experiment with including it into projects that aren't based on Material-UI. However - will give CSS modules a closer look when I'm next setting up a custom build, as it seems that some of the limitations I'm running into could be addressed by the right build configuration.