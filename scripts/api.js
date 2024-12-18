import * as Firebase from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import * as Firestore from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

export const FirebaseConfig = {
    apiKey: "AIzaSyCjTnpRwm3x9OkURhOPv7KxR6bTXAQaTxc",
    authDomain: "k24net-20a6a.firebaseapp.com",
    projectId: "k24net-20a6a",
    storageBucket: "k24net-20a6a.firebasestorage.app",
    messagingSenderId: "370532999130",
    appId: "1:370532999130:web:9cd880e46bff29592e2ae3",
    measurementId: "G-KP5C19Z534"
};

export const App = Firebase.initializeApp(FirebaseConfig);
export const Analytics = getAnalytics(App);
export const Db = Firestore.getFirestore(App);

export const Topbar = document.querySelectorAll("topbar")[0];
export const Sidebar = document.querySelectorAll("sidebar")[0];
export const Content = document.querySelectorAll("content")[0];

export const UsernameLabel = document.querySelector(".UsernameLabel");

export const ClassDataDocumentId = "vhgq5RSoT6QrTkOd3OVj";

export class Storage {
    constructor(Collection = "") {
        this.Collection = Collection;
    }

    async AppendDocument(DocumentData) {
        if (!this.Collection) return;
        const DocRef = await Firestore.addDoc(Firestore.collection(Db, this.Collection), DocumentData);
        return DocRef.id;
    }

    async GetDocument(DocumentId) {
        if (!this.Collection) return;
        const DocRef = Firestore.doc(Db, this.Collection, DocumentId);
        const Snapshot = await Firestore.getDoc(DocRef);
        
        if (Snapshot.exists()) return { id: Snapshot.id, ...Snapshot.data() };
        else return null;
    }    

    async UpdateDocument(DocumentId, DocumentData) {
        if (!this.Collection) return;
        const DocRef = Firestore.doc(Db, this.Collection, DocumentId);
        await Firestore.updateDoc(DocRef, DocumentData);
    }

    async DeleteDocument(DocumentId) {
        if (!this.Collection) return;
        const DocRef = Firestore.doc(Db, this.Collection, DocumentId);
        await Firestore.deleteDoc(DocRef);
    }

    async GetDocuments(Query = {}) {
        if (!this.Collection) return;
        const CollectionRef = Firestore.collection(Db, this.Collection);
        let QueryRef = CollectionRef;
        Object.entries(Query).forEach(([Key, Value]) => {
            QueryRef = Firestore.query(QueryRef, Firestore.where(Key, "==", Value));
        });
        const QuerySnapshot = await Firestore.getDocs(QueryRef);
        return QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    async GetDocumentsByField(FieldName, FieldValue) {
        if (!this.Collection) return;
        const QueryRef = Firestore.query(
            Firestore.collection(Db, this.Collection),
            Firestore.where(FieldName, "==", FieldValue)
        );
        const QuerySnapshot = await Firestore.getDocs(QueryRef);
        return QuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

export function StringfyUserType(Type) {
    if (Type === "0001") return "HT";
    if (Type === "0002") return "ST";
    return "Other";
}

export async function GetClassData() {
    const NewStorage = new Storage("Class");
    return await NewStorage.GetDocument(ClassDataDocumentId);
}

export async function UpdateClassData(DocumentData) {
    const NewStorage = new Storage("Class");
    await NewStorage.UpdateDocument(ClassDataDocumentId, DocumentData);
}

export function FormatEpochTime(EpochTime) {
    const NewDate = new Date(EpochTime * 1000);
    const Hours = String(NewDate.getHours()).padStart(2, "0");
    const Minutes = String(NewDate.getMinutes()).padStart(2, "0");
    const Day = String(NewDate.getDate()).padStart(2, "0");
    const Month = String(NewDate.getMonth() + 1).padStart(2, "0");
    const Year = NewDate.getFullYear();

    return `${Hours}:${Minutes} ${Day}.${Month}.${Year}`;
}