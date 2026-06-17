Welcome to Patterns

A React Native and TypeScript mobile app.
A journal to record thoughts and feelings, either by typing, or with voice
transcripts using text-to-speech native iOS and Android functionalities.

Auth and storage handled by Supabase (free-tier).

Test suite built using Jest and React Testing Library.
Use `npx jest` to run the tests.

~Use `npx expo start` to run the local server.~
Outdated: this was good until we had the voice native module, which does not
work on Expo Go.
Now if you wanna run the app in the simulator, you need to run the developer
build:

```bash
cd ios
pod install
cd ..
npx expo run:ios
```

It will take a minute.
The pod install is necessary only the first time.
`npx expo run:ios`
will suffice unless you make changes that require it to make the build

At the moment I am developing for iOS and not android, because the text-to-speech
is fully on-device in iOS, while in android, Google needs to connect to the
internet to query the speech recognition service.
I wanted to try to develop this in the lightest possible way at first.

Use an iOS simulator (I'm using iPhone 17 set up via XCode) or an
Android emulator (Pixel 10 via Android studio)
