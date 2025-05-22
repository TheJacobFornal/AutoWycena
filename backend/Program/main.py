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

#curr_dir = Path(__file__).parent
#main_dir = curr_dir.parent
#excel_dir = main_dir / "Excel"
#excel_estimate_path = excel_dir / "_kalkulacja edit.xlsx"

template_path = r"C:\Users\Jacob_Champ\Desktop\Excel\kalulacje_template.xlsx"

number_of_elem = 3
### Part 0 ###
def check_if_excel_open(path):
    try:
        with open(path, "r+"):
            return False
    except IOError:
        return True


def main(elem_id):
    global number_of_elem
    if check_if_excel_open(excel_estimate_path):
        print("Excel opened, close it to start program")
        sys.exit()

    print("elem: ", elem_id, flush=True)
    print("elem neum: ", number_of_elem, flush=True)
    part_1.main(elem_id, orders_path, excel_estimate_path,  number_of_elem)
    print("elem id: main xddd", elem_id)


def open_Excel_calculation():
    if 'excel_estimate_path' not in globals() and not excel_estimate_path.exists():
        return
    os.startfile(excel_estimate_path)

def open_Excel_orders():
    if 'orders_path' not in globals() and orders_path.exists():
        return
    os.startfile(orders_path)

def copy_template():
    shutil.copy(template_calculation, excel_estimate_path)

def set_oerder_path(path):
    global orders_path
    orders_path = Path(path).resolve()
    if orders_path.exists():
        os.startfile(orders_path)

def set_calculaion_path(folder_path):
    print("Kubaaa")
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
    print("szef", flush=True)
    global orders_path
    orders_path = select_file()
    
def dialog_folder():
    print("folder", flush=True)
    folder = select_folder()
    set_calculaion_path(folder)


def set_number_of_elem(number):
    global number_of_elem
    number_of_elem = number
    





















