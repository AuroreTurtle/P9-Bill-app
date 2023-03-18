/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import Bills from "../containers/Bills.js";

import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async () => {
            Object.defineProperty(window, "localStorage", { value: localStorageMock });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            await waitFor(() => screen.getByTestId("icon-window"));
            const windowIcon = screen.getByTestId("icon-window");
            //to-do write expect expression
            expect(windowIcon).toHaveClass("active-icon");
        });

        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills });
            const dates = screen
                .getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
                .map((a) => a.innerHTML);
            const antiChrono = (a, b) => a - b;
            const datesSorted = [...dates].sort(antiChrono);
            expect(dates).toEqual(datesSorted);
        });

        //Test handleClickIconEye
        describe("When I click on eye icon", () => {
            test("Then the modal open", () => {
                // Simulation du stockage de données de l'utilisateur et de la connexion en tant qu'employé
                Object.defineProperty(window, "localStorage", { value: localStorageMock });
                window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
                const onNavigate = (pathname) => {
                    document.body.innerHTML = ROUTES({ pathname });
                };

                // Affichage des notes de frais
                document.body.innerHTML = BillsUI({ data: bills });
                const billsContainer = new Bills({
                    document,
                    onNavigate,
                    store: null,
                    localStorage: window.localStorage,
                });

                //Affiche la modale
                $.fn.modal = jest.fn();

                // Création de la méthode handleClickIconEye
                const mockHandleClickIconEye = jest.fn(() => {
                    billsContainer.handleClickIconEye;
                });
                const iconEye = screen.getAllByTestId("icon-eye")[0];
                iconEye.addEventListener("click", mockHandleClickIconEye);
                // Simulation du clic
                fireEvent.click(iconEye);
                expect(mockHandleClickIconEye).toHaveBeenCalled();
                expect($.fn.modal).toHaveBeenCalled();
            });
        });

        // Test GET
        describe("When I get bills", () => {
            test("Then bills should be displayed", async () => {
                localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
                const root = document.createElement("div");
                root.setAttribute("id", "root");
                document.body.append(root);
                router();
                window.onNavigate(ROUTES_PATH.Bills);
                await waitFor(() => screen.getByText("Mes notes de frais"));

                //récupération des notes de frais dans le store
                const billsStore = new Bills({
                    document,
                    onNavigate,
                    store: mockStore,
                    localStorage: window.localStorage,
                });
                const bills = await billsStore.getBills();
                expect(bills.length).toBe(4);
            });
        });

        // Test Error
        describe("When an error occurs on API", () => {
            // Initialisation des variables nécessaires avant les tests
            beforeEach(() => {
                // Espionne la méthode bills() du mockStore et définit un localStorage fictif pour simuler le stockage des données de l'utilisateur
                jest.spyOn(mockStore, "bills");
                Object.defineProperty(window, "localStorage", { value: localStorageMock });
                window.localStorage.setItem(
                    "user",
                    JSON.stringify({
                        type: "Employee",
                        email: "a@a",
                    })
                );
                const root = document.createElement("div");
                root.setAttribute("id", "root");
                document.body.appendChild(root);
                router();
            });

            test("Then I fetch the bills in the API and fails with 404 message error", async () => {
                // Simulation du cas où la méthode list() du mockStore échoue avec un message d'erreur 404
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                        list: () => {
                            return Promise.reject(new Error("Erreur 404"));
                        },
                    };
                });
                window.onNavigate(ROUTES_PATH.Bills);
                await new Promise(process.nextTick);
                // Cherche le texte "Erreur 404"
                const message = await screen.getByText(/Erreur 404/);
                expect(message).toBeTruthy();
            });

            test("Then I fetch the bills in the API and fails with 500 message error", async () => {
                // Simulation du cas où la méthode list() du mockStore échoue avec un message d'erreur 500
                mockStore.bills.mockImplementationOnce(() => {
                    return {
                        list: () => {
                            return Promise.reject(new Error("Erreur 500"));
                        },
                    };
                });
                window.onNavigate(ROUTES_PATH.Bills);
                await new Promise(process.nextTick);
                // Cherche le texte "Erreur 500"
                const message = await screen.getByText(/Erreur 500/);
                expect(message).toBeTruthy();
            });
        });
    });
});
