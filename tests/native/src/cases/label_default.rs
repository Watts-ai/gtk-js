use relm4::prelude::*;

pub struct LabelDefault;

#[relm4::component(pub)]
impl SimpleComponent for LabelDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Label {
            set_label: "Label",
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
