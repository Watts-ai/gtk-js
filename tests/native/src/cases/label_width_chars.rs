use relm4::prelude::*;

pub struct LabelWidthChars;

#[relm4::component(pub)]
impl SimpleComponent for LabelWidthChars {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Hi",
            set_width_chars: 20,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
