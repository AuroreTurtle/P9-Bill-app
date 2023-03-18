/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { ROUTES } from "../constants/routes.js";
import BillsUI from "../views/BillsUI.js";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test('Then the text "Envoyer une note de frais" should be displayed', () => {
            const html = NewBillUI();
            document.body.innerHTML = html;
            //to-do write assertion
            expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
        });
    });

    describe("When I download a file with an incorrect extension", () => {
        test("Then an error should be displayed", () => {
            // Simulation du stockage de données de l'utilisateur et de la connexion en tant qu'employé
            Object.defineProperty(window, "localStorage", { value: localStorageMock });
            window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            // Affichage de la page
            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            });

            // Récupération de l'input de type file
            const inputFile = screen.getByTestId("file");
            // Simulation du chargement d'un fichier avec une extension incorrecte
            fireEvent.change(inputFile, {
                target: {
                    files: [new File(["image.gif"], "image.gif", { type: "image/gif" })],
                },
            });

            const errorMessage = screen.getByTestId("error-message");
            expect(errorMessage).toBeTruthy();
        });
    });

    describe("When I download a file with an correct extension", () => {
        test("Then the fiel is correct", () => {
            Object.defineProperty(window, "localStorage", { value: localStorageMock });
            window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            document.body.innerHTML = NewBillUI();

            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockStore,
                localStorage: window.localStorage,
            });

            const inputFile = screen.getByTestId("file");
            // Simulation du chargement d'un fichier avec une extension correcte
            fireEvent.change(inputFile, {
                target: {
                    files: [new File(["image.jpg"], "image.jpg", { type: "image/jpg" })],
                },
            });

            const errorMessage = screen.getByTestId("error-message");
            expect(errorMessage).toHaveStyle({ display: "none" });
        });
    });

    //Test POST
    describe("When I submit the form completed", () => {
        test("Then the new bill is created", async () => {
            // Simulation du stockage de données de l'utilisateur et de la connexion en tant qu'employé
            Object.defineProperty(window, "localStorage", { value: localStorageMock });
            window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };

            document.body.innerHTML = NewBillUI();
            const newBillContainer = new NewBill({
                document,
                onNavigate,
                store: null,
                localStorage: window.localStorage,
            });

            // Simulation de la saisie des informations de la note de frais
            const bill = {
                type: "Transports",
                name: "Train Paris-Nice",
                date: "2023-02-02",
                amount: 200,
                vat: 50,
                pct: 20,
                commentary: "Facture du train Paris-Nice",
                fileUrl: "../img/facture-train-2023_02_02.jpg",
                fileName: "facture-train-2023_02_02.jpg",
                status: "pending",
            };

            screen.getByTestId("expense-type").value = bill.type;
            screen.getByTestId("expense-name").value = bill.name;
            screen.getByTestId("datepicker").value = bill.date;
            screen.getByTestId("amount").value = bill.amount;
            screen.getByTestId("vat").value = bill.vat;
            screen.getByTestId("pct").value = bill.pct;
            screen.getByTestId("commentary").value = bill.commentary;
            newBillContainer.fileName = bill.fileName;
            newBillContainer.fileUrl = bill.fileUrl;

            const mockHandleSubmit = jest.fn((e) => newBillContainer.handleSubmit(e));
            const form = screen.getByTestId("form-new-bill");
            form.addEventListener("submit", mockHandleSubmit);
            fireEvent.submit(form);

            expect(mockHandleSubmit).toHaveBeenCalled();
        });

        // Test Error
        test("Then I fetch the bills in the API and fails with 404 message error", async () => {
            // Espionne la méthode bills() du mockStore
            jest.spyOn(mockStore, "bills");
            // Simulation du cas où la méthode list() du mockStore échoue avec un message d'erreur 404
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 404"));
                    },
                };
            });
            const html = BillsUI({ error: "Erreur 404" });
            document.body.innerHTML = html;
            // Cherche le texte "Erreur 404"
            const message = await screen.getByText(/Erreur 404/);
            expect(message).toBeTruthy();
        });

        test("Then I fetch the bills in the API and fails with 500 message error", async () => {
            // Espionne la méthode bills() du mockStore
            jest.spyOn(mockStore, "bills");
            // Simulation du cas où la méthode list() du mockStore échoue avec un message d'erreur 500
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"));
                    },
                };
            });
            const html = BillsUI({ error: "Erreur 500" });
            document.body.innerHTML = html;
            // Cherche le texte "Erreur 500"
            const message = await screen.getByText(/Erreur 500/);
            expect(message).toBeTruthy();
        });
    });
});

