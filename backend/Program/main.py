from csv import excel
from operator import truediv
from Program.Part1 import Part1 as part_1
import os
import sys
from openpyxl import load_workbook
from pathlib import Path
import shutil
import tkinter as tk
from tkinter import filedialog
from fastapi import HTTPException

orders_path = None
excel_estimate_path = None
template_calculation = None
number_of_elem = 3


template_path = r"C:\Users\Jacob_Champ\Desktop\Excel\kalulacje_template.xlsx"


### Part 0 ###
def check_if_excel_open(path):
    try:
        with open(path, "r+"):
            return False
    except IOError:
        return True

def main(elem_id):
    global number_of_elem

    path1 = Path(orders_path) if isinstance(orders_path, str) else orders_path
    path2 = Path(excel_estimate_path) if isinstance(excel_estimate_path, str) else excel_estimate_path

    if not path1 or not path2:
        raise HTTPException(status_code=400, detail="Ścieżki do plików Excel nie zostały ustawione.")
    if not path1.exists():
        raise HTTPException(status_code=404, detail=f"Plik nie istnieje: {path1}")
    if not path2.exists():
        raise HTTPException(status_code=404, detail=f"Plik nie istnieje: {path2}")
    if check_if_excel_open(path2):
        raise HTTPException(status_code=400, detail="Excel Kalkulacja jest otwarty. Zamknij plik, aby kontynuować.")

    result = part_1.main(elem_id, path1, path2, number_of_elem)

    if not result:
        raise HTTPException(status_code=404, detail=f"Nie znaleziono ID: {elem_id} w pliku Zamówienia.")





def open_Excel_calculation():
    if 'excel_estimate_path' not in globals() or excel_estimate_path is None:
        raise HTTPException(status_code=400, detail="Excel Kalkulacja nie ustawiony")
    if not excel_estimate_path.exists():
        raise HTTPException(status_code=404, detail="Excel Kalkulacja nie ustawiony")
    os.startfile(excel_estimate_path)
    return {"message": "Excel Kalkulacja Otwarty"}


def open_Excel_orders():
    if 'orders_path' not in globals() or orders_path is None:
        raise HTTPException(status_code=400, detail="Excel Zamówienia nie ustawiony")
    if not excel_estimate_path.exists():
        raise HTTPException(status_code=404, detail="Excel Zamówienia nie ustawiony")
    os.startfile(orders_path)
    return {"message": "Excel Zamówienia Otwarty"}

def copy_template():
    shutil.copy(template_calculation, excel_estimate_path)

def set_oerder_path(path):
    global orders_path
    orders_path = Path(path).resolve()
    if orders_path.exists():
        os.startfile(orders_path)

def set_calculaion_path(folder_path):
    global excel_estimate_path, template_calculation
    folder = Path(folder_path)
    template_calculation = folder / "calculation_template.xlsx"
    print(template_calculation, flush=True)
    for elem in folder.iterdir():
        if "kalkulacje" in elem.name.lower() and elem.is_file():
            excel_estimate_path = elem
            print("set: ",excel_estimate_path, flush=True)
            break
    
    


def select_file():
    root = tk.Tk()
    root.withdraw() 

    file_path = filedialog.askopenfilename(
        title="Select a Excel Orders...",
    )

    return file_path


def select_folder():
    root = tk.Tk()
    root.withdraw() 

    folder_path = filedialog.askdirectory(
        title = "Select a folder..."
    )

    return folder_path
    
def dialog_orders():
    global orders_path
    orders_path = select_file()
    
def dialog_folder():
    folder = select_folder()
    set_calculaion_path(folder)


def set_number_of_elem(number):
    global number_of_elem
    number_of_elem = number
    





















